interface RequestProps {
  task_type: string;
  prompt: {
    caption: string;
    batch_size: number;
  };
}

interface Task {
  object: string;
  id: string;
  created: number;
  task_type: string;
  status: string;
  status_information: {};
  prompt_id: string;
  generations: Generations;
  prompt: {
    id: string;
    ojbect: string;
    created: number;
    prompt_type: string;
    prompt: { caption: string };
    parent_generation_id: string | null;
  };
}

export interface Generations {
  object: string;
  data: [
    {
      id: string;
      object: string;
      created: number;
      generation_type: string;
      generation: { image_path: string };
      task_id: string;
      prompt_id: string;
      is_public: boolean;
    }
  ];
}

export class Dalle {
  bearerToken: string;
  url: string;
  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
    this.url = "https://labs.openai.com/api/labs/tasks";
  }

  async generate(prompt: string) {
    const body: RequestProps = {
      task_type: "text2im",
      prompt: { caption: prompt, batch_size: 4 },
    };

    return new Promise<Generations>(async (resolve, reject) => {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(response);
        return;
      }

      const data: Task = await response.json();

      const taskId = data.id;

      const refreshIntervalId = setInterval(async () => {
        const response = await fetch(`${this.url}/${taskId}`, {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log(response);
          return;
        }

        const data: Task = await response.json();

        if (data.status === "rejected") {
          clearInterval(refreshIntervalId);
          resolve(data.status_information as Generations);
        } else if (data.status === "succeeded") {
          const generations = data.generations;
          clearInterval(refreshIntervalId);
          resolve(generations as Generations);
        }
      }, 3000);
    });
  }
}
